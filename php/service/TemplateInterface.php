<?php

class TemplateInterface extends Service
{
    public $user;
    public $request;
    
    public function onRegister()
    {
        parent::onRegister();
        
        // -----
        
        $this->user    = $this->get('user');
        $this->request = $this->get('request');
    }
    
    public function asset($file)
    {
        $rootUrl = $this->request->getRootUrl();
        
        return (strlen($rootUrl) < 2 ? '' : $rootUrl) . '/' . $file;
    }
    
    public function path($actionName)
    {
        return $this->request->getRootUri() . '?' . $this->get('router')->getRoute($actionName);
    }
    
    public function url($actionName)
    {
        return $this->request->getRootUriFull() . '?' . $this->get('router')->getRoute($actionName);
    }
}

?>
